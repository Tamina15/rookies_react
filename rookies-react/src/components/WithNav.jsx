import React from 'react';
import {default as NavBar} from './Navbar';
import { Outlet } from 'react-router';

export default () => {
  return (
    <>
      <NavBar />
      {/* <Outlet /> */}
    </>
  );
};