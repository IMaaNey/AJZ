import { useEffect, useState } from 'react'

export default function AdminHolidaysPage() {
  const [holidays, setHolidays] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', date: '', description: '' })

  useEffect(()=>{ load() }, [])
  function load(){ fetch('/api/admin/holidays').then(r=>r.json()).then(data=>setHolidays(data.holidays || [])) }

  async function submit(e:any){
    e.preventDefault()
    await fetch('/api/admin/holidays', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(form) })
    setForm({ name: '', date: '', description: '' })
    load()
  }

  async function remove(id:number){
    if(!confirm('Delete holiday?')) return
    await fetch(`/api/admin/holidays/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Holidays</h1>
        <form onSubmit={submit} className="mb-6 bg-white p-4 rounded shadow space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="border p-2" />
            <input type="date" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} className="border p-2" />
            <input placeholder="Description" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} className="border p-2" />
          </div>
          <div>
            <button className="bg-blue-600 text-white px-3 py-2 rounded">Add Holiday</button>
          </div>
        </form>

        <div className="bg-white rounded shadow p-4">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Date</th>
                <th className="text-left">Description</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((h)=> (
                <tr key={h.id} className="border-t">
                  <td className="py-2">{h.name}</td>
                  <td>{new Date(h.date).toLocaleDateString()}</td>
                  <td>{h.description}</td>
                  <td><button onClick={()=>remove(h.id)} className="text-red-600">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
