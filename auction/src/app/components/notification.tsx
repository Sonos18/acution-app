import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useEffect } from 'react';

export default function Notification (){
    const loadNotifications=() => {
        
    }   
    useEffect(()=>{
        loadNotifications()
    },[])
    return(
        <div className='my-auto'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <NotificationsNoneIcon className='h-full w-full hover:text-yellow-700'/>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuItem className='bg-slate-200 focus:bg-slate-300'>
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='bg-slate-200'>
                        <span>Profile</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}