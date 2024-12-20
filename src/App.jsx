import './App.css'
import { Routes,Route } from "react-router-dom";
import Todo from './Components/ToDO/Todo'
import TODO02 from './Components02/TODO02/TODO02';


import TODO03 from "./Components03/TODO03/TODO03"
import TODOITEMS03 from "./Components03/TODOITEMS03/TODOITEMS03"
import BlogView from './Components03/BlogView/BlogView';
function App() {


  return (
   <>
   <Routes>
    {/* <Todo /> */}
    {/* <TODO02 /> */}
    <Route path="/" element={< TODO03 />} />
    <Route path="/items" element={< TODOITEMS03  />} />
    <Route path="/blog-view" element={<BlogView  />} />
    
    </Routes>
   </>
  )
}

export default App;
