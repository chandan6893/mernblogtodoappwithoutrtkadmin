import React, { useEffect,useState } from 'react';

const TODOITEMS02 = () => {
  const [ allData, setAllData ] = useState([]);
  console.log("allData",allData)

  const getAllData = () => {
    fetch("http://localhost:4001/todo/api/gettodoitems")
      .then((res) => res.json())
      .then((data) => setAllData(data))
      .catch((err) => console.error("Error fetching todos:", err));
  };

  useEffect(() => {
    getAllData();
  }, []);
  return (
    <div className='TODOITEMS02'>
       {
        allData.map((ele,index)=>{
          return <div key={index} style={{padding:"3rem"}} >
            <div dangerouslySetInnerHTML={{ __html: ele.name }} style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}></div>
          </div>
        })
       }
    </div>
  )
}

export default TODOITEMS02;