import { useEffect, useState } from 'react'

export default function AdminEmployees() {
  const [employees, setEmployees] = useState<any[]>([])
  const [form, setForm] = useState({ fullName: '', email: '', password: '', designation: '' })

  useEffect(()=>{
    load()
  }, [])

  function load() {
    fetch('/api/admin/employees').then(r=>r.json()).then(data=>setEmployees(data.employees || []))
  }

  async function submit(e: any) {
    e.preventDefault()
    await fetch('/api/admin/employees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setForm({ fullName: '', email: '', password: '', designation: '' })
    load()
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Employees</h1>
        <form onSubmit={submit} className="mb-6 bg-white p-4 rounded shadow space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Full name" value={form.fullName} onChange={(e)=>setForm({...form, fullName:e.target.value})} className="border p-2" />
            <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className="border p-2" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} className="border p-2" />
            <input placeholder="Designation" value={form.designation} onChange={(e)=>setForm({...form, designation:e.target.value})} className="border p-2" />
          </div>
          <button className="bg-blue-600 text-white px-3 py-2 rounded">Create Employee</button>
        </form>

        <div className="bg-white rounded shadow p-4">
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
