<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;

class ReservationController extends Controller
{
    // Nfs durée f kolchi (3 sa3at)
    private const DURATION_HOURS = 3;

    public function getTables(Request $request)
    {
        $date = $request->get('date', Carbon::today()->toDateString());
        $time = $request->get('time');

        // FIX: nfs logique dyal getAvailableTables (window 3 sa3at) machi time exact
        $tables = Table::with(['reservations' => function ($query) use ($date) {
            $query->where('date', $date)->where('status', 'confirmed');
        }])->get();

        foreach ($tables as $table) {
            $table->status = $this->getTableAvailability($table, $date, $time);
        }

        // FIX: ma-nkchfouch smiyat/telephones dyal les clients f response public
        return response()->json($tables->makeHidden('reservations')->values());
    }

    private function getTableAvailability($table, $date, $requestedTime)
    {
        if (!$requestedTime) {
            return 'available';
        }

        try {
            // FIX: Carbon::parse (createFromFormat 'H:i' kay-tfشل ila time jat 'H:i:s' -> kan ydir dima 'available')
            $requestStart = Carbon::parse($date . ' ' . $requestedTime);
            $requestEnd = $requestStart->copy()->addHours(self::DURATION_HOURS);

            foreach ($table->reservations as $reservation) {
                $resDate = Carbon::parse($reservation->date)->toDateString();
                $resStart = Carbon::parse($resDate . ' ' . $reservation->time);
                $resEnd = $resStart->copy()->addHours(self::DURATION_HOURS);

                // Overlap: bda9 9bel ma-ykml l-akhor o ykml mn ba3d ma-ybda
                if ($requestStart->lt($resEnd) && $requestEnd->gt($resStart)) {
                    return 'occupied';
                }
            }

            return 'available';
        } catch (Exception $e) {
            return 'available';
        }
    }

    public function getAvailableTables(Request $request)
    {
        $date = $request->get('date', Carbon::today()->toDateString());
        $time = $request->get('time');
        $guests = $request->get('guests', 1);

        $tables = Table::where('seats', '>=', $guests)
            ->with(['reservations' => function ($query) use ($date) {
                $query->where('date', $date)->where('status', 'confirmed');
            }])->get();

        $availableTables = $tables->filter(function ($table) use ($date, $time) {
            return $this->getTableAvailability($table, $date, $time) === 'available';
        });

        // FIX: ma-nrj3ouch reservations (données dyal clients) f response
        return response()->json($availableTables->makeHidden('reservations')->values());
    }

    public function store(Request $request)
    {
        // FIX: validate barra men try/catch -> ValidationException kant kat-wsl 500
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'table_id' => 'required|exists:tables,id',
            'guests' => 'sometimes|integer|min:1|max:20',
        ]);

        try {
            // FIX: transaction + lock bach 2 nas ma-yحجزوش nfs table f nfs lwe9t
            return DB::transaction(function () use ($validated, $request) {
                $table = Table::lockForUpdate()->findOrFail($validated['table_id']);

                if (isset($validated['guests']) && $table->seats < $validated['guests']) {
                    return response()->json([
                        'message' => 'الطاولة صغيرة على عدد الأشخاص، يرجى اختيار طاولة أخرى'
                    ], 422);
                }

                $table->load(['reservations' => function ($query) use ($validated) {
                    $query->where('date', $validated['date'])->where('status', 'confirmed');
                }]);

                // FIX: nfs check b7al getAvailableTables (kan time exact bark)
                if ($this->getTableAvailability($table, $validated['date'], $validated['time']) === 'occupied') {
                    return response()->json([
                        'message' => 'الطاولة محجوزة في هذا الوقت، يرجى اختيار طاولة أخرى أو وقت مختلف'
                    ], 422);
                }

                $reservation = Reservation::create([
                    'name' => $validated['name'],
                    'phone' => $validated['phone'],
                    'date' => $validated['date'],
                    'time' => $validated['time'],
                    'table_id' => $validated['table_id'],
                    'user_id' => $request->user()?->id,
                    'total_price' => $table->type === 'royal' ? $table->price : 0,
                    'status' => 'confirmed'
                ]);

                return response()->json([
                    'message' => 'Reservation created successfully',
                    'reservation' => $reservation->load('table')
                ], 201);
            });

        } catch (Exception $e) {
            // FIX: ma-nrj3ouch $e->getMessage() l client
            report($e);
            return response()->json([
                'message' => 'خطأ في إنشاء الحجز'
            ], 500);
        }
    }

    public function index()
    {
        $reservations = Reservation::with('table', 'user:id,name,email')
            ->orderBy('date', 'desc')
            ->orderBy('time', 'desc')
            ->get();

        return response()->json($reservations);
    }

    public function show($id)
    {
        $reservation = Reservation::with('table', 'user:id,name,email')->findOrFail($id);
        return response()->json($reservation);
    }

    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'date' => 'sometimes|date|after_or_equal:today',
            'time' => 'sometimes|date_format:H:i',
            'guests' => 'sometimes|integer|min:1|max:20',
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed'
        ]);

        $reservation->update($validated);

        return response()->json([
            'message' => 'Reservation updated successfully',
            'reservation' => $reservation->load('table')
        ]);
    }

    public function destroy($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->delete();

        return response()->json([
            'message' => 'تم حذف الحجز بنجاح'
        ]);
    }
}
