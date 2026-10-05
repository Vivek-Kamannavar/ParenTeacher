import React from 'react';
import ParentsApp from './ParentsApp';
import TeacherApp from './TeacherApp';

export default function App() {
  const path = window.location.pathname.toLowerCase();
  
  if (path.includes('/teacher')) {
    return <TeacherApp />;
  }

  return <ParentsApp />;
}
