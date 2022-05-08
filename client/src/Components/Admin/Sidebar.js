import React from 'react'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import HistoryIcon from '@mui/icons-material/History';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
export const SidebarData=[ 
  {
    title :"users",
    icon : <PeopleOutlineIcon/>,
    link :"/UserList"
  },
  {
    title :"products",
    icon : <ShoppingCartIcon/>,
    link :"/productList"
  },
  {
    title :"Reported",
    icon : <HistoryIcon/>,
    link :"/reportedProducts"
  },
]

