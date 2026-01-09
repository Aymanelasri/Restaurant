<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Table;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Exception;

class ReservationController extends Controller
{
    public function getTables(Request $request)
    {
        $date = $request->get('date', Carbon::today()->toDateString());
        $time = $request->get('time');

        $tables = Table::all();

        foreach ($tables as $table) {
            $table->status = 'available';

            if ($time) {
                // Check if table has reservations for this date and time
                $hasConflict = $table->reservations()
                    ->where('date', $date)
                    ->where('time', $time)
                    ->where('status', 'confirmed')
                    ->exists();

                if ($hasConflict) {
                    $table->status = 'occupied';
                }
            }
        }

        return response()->json($tables);
    }

    private function getTableAvailability($table, $date, $requestedTime)
    {
        if (!$requestedTime) {
            return 'available';
        }

        try {
            $requestedDateTime = Carbon::createFromFormat('Y-m-d H:i', $date . ' ' . $requestedTime);

            foreach ($table->reservations as $reservation) {
                $reservationDateTime = Carbon::createFromFormat('Y-m-d H:i', $reservation->date . ' ' . $reservation->time);
                $endTime = $reservationDateTime->copy()->addHours(3);

                if ($requestedDateTime->between($reservationDateTime, $endTime) ||
                    $requestedDateTime->copy()->addHours(3)->between($reservationDateTime, $endTime) ||
                    ($requestedDateTime->lt($reservationDateTime) && $requestedDateTime->copy()->addHours(3)->gt($endTime))) {
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
            ->with(['reservations' => function($query) use ($date) {
                $query->where('date', $date)->where('status', 'confirmed');
            }])->get();

        $availableTables = $tables->filter(function($table) use ($date, $time) {
            return $this->getTableAvailability($table, $date, $time) === 'available';
        });

        return response()->json($availableTables->values());
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'date' => 'required|date|after_or_equal:today',
                'time' => 'required',
                'table_id' => 'required|exists:tables,id',

            ]);

            $table = Table::findOrFail($validated['table_id']);

            // Simple availability check
            $existingReservation = Reservation::where('table_id', $validated['table_id'])
                ->where('date', $validated['date'])
                ->where('time', $validated['time'])
                ->where('status', 'confirmed')
                ->first();

            if ($existingReservation) {
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
                'user_id' => $request->user()->id,
                
                'total_price' => $table->type === 'royal' ? $table->price : 0,
                'status' => 'confirmed'
            ]);

            return response()->json([
                'message' => 'Reservation created successfully',
                'reservation' => $reservation->load('table')
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'خطأ في إنشاء الحجز: ' . $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        $reservations = Reservation::with('table', 'user')
            ->orderBy('date', 'desc')
            ->orderBy('time', 'desc')
            ->get();

        return response()->json($reservations);
    }

    public function show($id)
    {
        $reservation = Reservation::with('table', 'user')->findOrFail($id);
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
            'message' => 'تم تحديث الحجز بنجاح',
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
