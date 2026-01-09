import React from 'react';

export default function StatCard({title, value}) {
  return (
    <div style={{padding:12, border:'1px solid #e5e7eb', borderRadius:8}}>
      <div style={{fontSize:12,color:'#6b7280'}}>{title}</div>
      <div style={{fontSize:20,fontWeight:600}}>{value}</div>
    </div>
  );
}
