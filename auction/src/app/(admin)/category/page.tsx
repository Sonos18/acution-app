import { TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Table } from "@mui/material"
import { CategoryRow } from "../_component/category-row-item"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function CategoryPage(){
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
              category.map((cat,idx) => <CategoryRow key={idx} category={cat} />)}
          </TableBody>
        </Table>
        <div className="flex justify-center items-center">
        <Label htmlFor="category" className="mr-2">Name Category</Label>
          <Input
            id="category"
            placeholder="Enter Name"
          />
        <button className="ml-4 px-4 py-2 border bg-green-300 border-emerald-500/20 text-white text-center rounded-full">
          <span>Add Category</span>
        </button>
        </div>
        </div>
        </>
    )
}

const category = [{
    name: "Electronics",
    date: "2024-01-01",
},{
    name: "Fashion",
    date: "2024-02-01",
},
{
    name: "Home & Garden",
    date: "2024-03-01",
},{
    name:"Sporting Goods",
    date: "2024-04-01",
}]