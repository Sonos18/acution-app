"use client";

import type { RootState } from '@/store/store'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '@/components/ui/moving-border'
import blogApiRequest from '@/apiRequests/blog';
import { setBlogs } from '@/store/blogSlice';

export default function Page() {
    // const dispatch = useDispatch()
    // const blogs=useSelector((state:RootState)=>state..blog)
    // const submit = async() => {
    //     const params ="?limit=10"
    //   const response = await blogApiRequest.getBlogs(params);
    //   dispatch(setBlogs(response.payload.data));
    // }
    const remove=()=>{
    }
    return (
    <div>
        {/* <Button onClick={submit}>Load Blog</Button>
        {blogs&&blogs.map((blog,index)=><div key={index}>{blog.blogId}</div>)} */}
        <Button onClick={remove}>Remove User</Button>
    </div>
    )

}