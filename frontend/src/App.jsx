import {useState, useEffect} from 'react'
import axios from "axios"
import { format } from "date-fns"
import { TiDeleteOutline } from "react-icons/ti";
import { CiEdit } from "react-icons/ci";



const baseUrl = "http://localhost:5000"



function App() {

const [editing, setEditing]=useState(false)
const [description, setDescription] = useState('')
const [eventsList, setEventsList] = useState([])
const [eventId, setEventId] = useState(null)

const fetchEvents = async () => {
  const data = await axios.get(`${baseUrl}/events`)
  const { events } = data.data
  setEventsList(events)
}

const handleChange = (e) => {
    setDescription(e.target.value)
}

const handleDelete = async (id) => {
  const userresponse = window.confirm('Are you sure you want to delete?')
  if (userresponse) {
      try {
          await axios.delete(`${baseUrl}/events/${id}`)
          const updateList = eventsList.filter(event => event.id != id)
          setEventsList(updateList)
      } catch (err) {
          console.error(err)
      }
  }
  setEditing(false)
}

const handleEdit = async (id) => {
  const data = await axios.get(`${baseUrl}/events/${id}`)
  setEditing(true)
  setEventId(data.data.id)
  setDescription(data.data.description)
}

const handleSubmit = async (e) => {
  e.preventDefault();
  if (description.trim() === '') {
    setEditing(false)
    return false
  } else {
    try {
      if (editing) {
        await axios.put(`${baseUrl}/events/${eventId}`, { description })
        fetchEvents()
      } else {
        const data = await axios.post(`${baseUrl}/events`, { description })
        setEventsList([...eventsList, data.data])
      }
      setDescription('')
      setEventId(null)
      setEditing(false)
    } catch (err) {
      console.error(err)
    }
  }
}

useEffect(() => {
  fetchEvents();
}, [])



  return (
    <div className='bg-indigo-200 px-8 min-h-screen'>
      <nav className='pt-8'>
        <h1 className='text-xl text-center pb-12 font-bold'>Event List with Flask & React</h1>
      </nav>
      <section>

        <form onSubmit={handleSubmit}>
          <label className='mr-3 font-semibold' htmlFor='description'>Description:</label>
          <input
            className='inline-block bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 appearance-none leading-normal'
            type='text'
            name='description'
            id='description'
            value={description}
            onChange={(e) => handleChange(e)}
          />
          <button className='ml-3 inline-block bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-lg' 
          type='Submit'>
            {editing ? 'Update' : 'Add New'}
            </button>
        </form>

      </section>
      <section>
        <table className='w-11/12 max-w-4xl align-middle'>
          <thead className='border-b-2 border-black'>
            <tr>
              <th className='p-3 text-sm font-semibold tracking-wide text-left'>
                Description
              </th>
              <th className='p-3 text-sm font-semibold tracking-wide text-center'>
                Created At
              </th>
              <th className='p-3 text-sm font-semibold tracking-wide text-center'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
          {eventsList.map(event => {
                return (
                    <tr className='border-b border-black' key={event.id}>
                        <td className='p-3 text-sm'>
                            {event.description}
                        </td>
                        <td className='p-3 text-sm text-center'>
                            {format(new Date(event.created_at), "dd/MM/yyyy, p")}
                        </td>
                        <td className='p-3 text-sm font-medium grid grid-flow-col mt-2'>
                            <span className='text-3xl cursor-pointer'>
                                <CiEdit onClick={() => handleEdit(event.id)} />
                            </span>
                            <span className='text-3xl cursor-pointer'>
                                <TiDeleteOutline className='text-red-600' onClick={() => handleDelete(event.id)} />
                            </span>
                        </td>
                    </tr>
                )
            })
            }
          </tbody>
        </table>
      </section>
    </div>
  )
}
export default App
