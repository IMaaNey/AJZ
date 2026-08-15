import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [employees, setEmployees] = useState<any[]>([])

  useEffect(()=>{
    fetch('/api/admin/employees').then(r=>r.json()).then(data=>setEmployees(data.employees || []))
  }, [])

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">Total Employees<br/><div className="text-xl font-bold">{employees.length}</div></div>
          <div className="bg-white p-4 rounded shadow">Present Today<br/><div className="text-xl font-bold">--</div></div>
          <div className="bg-white p-4 rounded shadow">Currently Working<br/><div className="text-xl font-bold">--</div></div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Employees</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Designation</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e)=> (
                <tr key={e.id} className="border-t">
                  <td className="py-2">{e.fullName}</td>
                  <td>{e.user?.email}</td>
                  <td>{e.designation}</td>
                  <td>{e.user?.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
