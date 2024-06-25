"use client";

import { TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Table } from "@mui/material"
import { CategoryRow } from "../_component/category-row-item"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import categoryApiRequest from "@/apiRequests/category"
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function CategoryPage(){
  const [loading, setLoading] = useState<boolean>(false)
  const [category, setCategory] = useState<CategoryType[]|[]>([])
  const [name, setName] = useState<string>("")
  const loadCategory = async() => {
    const res= await categoryApiRequest.getAll();
    setCategory(res.payload)
  }
  const createCategory = async() => {
    try {
      setLoading(true);
      const res = await categoryApiRequest.create({nameCategory:name});
      setName("");
      if(res.status === 201){
            loadCategory();
      }
      toast({
      title:"Success",
      description:"Category created",
      className:"bg-green-500 text-white"
    })
    } catch (error) {
      toast({
        title:"Error",
        description:"Category not created",
        className:"bg-red-500 text-white"
      })
    }finally{
      setLoading(false)
    }
    
  }
  useEffect(() => {
    loadCategory()
  }, [])
  const onChanageCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
    return(
        <>
        <h1>Category</h1>
        <div className="w-10/12 mx-auto mt-2">
         <Table className="mx-auto">
          <TableHeader>
            <TableRow>
              <TableHead> Name</TableHead>
              <TableHead> Time</TableHead>
              <TableHead> Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {category.length > 0 &&
              category.map((cat,idx) => <CategoryRow loadCategory={loadCategory}key={idx} category={cat} />)}
          </TableBody>
        </Table>
        <div className="flex items-center mt-4">
        <Label htmlFor="category" className="mr-2">Name Category</Label>
          <Input
            id="category"
            placeholder="Enter Name"
            className="border border-emerald-500/20"
            onChange={onChanageCategory}
            value={name}
          />
        <button onClick={createCategory} 
        className="ml-4 px-4 py-2 border bg-green-300 border-emerald-500/20 text-white text-center rounded-full">
          <span>{loading ? "Loading...":"Create"}</span>
        </button>
        </div>
        </div>
        </>
    )
}
export interface CategoryType {
  categoryId: string;
  categoryName: string;
  createdAt: string;
}