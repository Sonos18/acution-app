"use client";
import {
  Table,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserResType } from "@/schemaValidations/user.schema";
import { TableBody } from "@mui/material";
import { useEffect, useState } from "react";
import UserRow from "../_component/user-row-item";
import userApiRequest from "@/apiRequests/user";

const UsersPage = () => {
  const [users, setUsers] = useState<UserResType[] | []>([]);
  const loadUsers = async () => {
    try {
      const res = await userApiRequest.getAll();
      console.log(res);

      // setUsers(res.payload);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    loadUsers();
  }, []);
  return (
    <div>
      <h1>Users</h1>
      <div>
        <Table>
          <TableCaption>Alist users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead> Avatar</TableHead>
              <TableHead> Username</TableHead>
              <TableHead> Email</TableHead>
              <TableHead> Role</TableHead>
              <TableHead> Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 &&
              users.map((user) => <UserRow key={user.userId} user={user} />)}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default UsersPage;
