import { useEffect, useState } from 'react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [schedules, setSchedules] = useState<any[]>([])
  const [form, setForm] = useState({ companyName: '', timezone: '', defaultScheduleId: '' })

  useEffect(()=>{ load() }, [])
  function load(){
    fetch('/api/admin/settings').then(r=>r.json()).then(data=>{ setSettings(data.settings); setSchedules(data.schedules || []); if (data.settings) setForm({ companyName: data.settings.companyName || '', timezone: data.settings.timezone || '', defaultScheduleId: data.settings.defaultScheduleId || '' }) })
  }

  async function submit(e:any){
    e.preventDefault()
    await fetch('/api/admin/settings', { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ companyName: form.companyName, timezone: form.timezone, defaultScheduleId: form.defaultScheduleId ? Number(form.defaultScheduleId) : undefined }) })
    load()
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Company Settings</h1>
        <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
          <div>
            <label className="block text-sm">Company Name</label>
            <input value={form.companyName} onChange={(e)=>setForm({...form, companyName: e.target.value})} className="w-full border p-2" />
          </div>
          <div>
            <label className="block text-sm">Timezone</label>
            <input value={form.timezone} onChange={(e)=>setForm({...form, timezone: e.target.value})} className="w-full border p-2" />
          </div>
          <div>
            <label className="block text-sm">Default Schedule</label>
            <select value={form.defaultScheduleId} onChange={(e)=>setForm({...form, defaultScheduleId: e.target.value})} className="w-full border p-2">
              <option value="">(none)</option>
              {schedules.map(s=> (<option key={s.id} value={s.id}>{s.name} ({s.startTime}-{s.endTime})</option>))}
            </select>
          </div>
          <div>
            <button className="bg-blue-600 text-white px-3 py-2 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
