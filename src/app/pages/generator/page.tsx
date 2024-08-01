import React from 'react'

export default function Generator()
{
  return (
    <main className='min-h-screen bg-black'>
      <div className='relative top-40 flex flex-col items-center justify-between space-y-10'>
        <h1 className='text-center text-white' style={{fontSize: 20}}>Generator</h1>
        <form className='flex flex-col space-y-10'>
            <input name="url" type='text' placeholder='Enter Url:' required />

            <input name="topic" type='text' placeholder='Enter Topic:' required />

            <select name='citation-style' id='style' required>
              <option value='none' disabled>Select a Citation Style</option>
              <option value='MLA'>MLA</option>
              <option value='APA'>APA</option>
              <option value='CHICAGO'>CHICAGO</option>
            </select>
            <br />
            <br />

            <button type='submit' style={{width: 100}} className='ml-10 bg-purple-500'>Submit</button> 
        </form>
      </div>
    </main>
  )
}
