// src/pages/PartPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Part1 from './Part1';

export default function PartPage() {
  const { number } = useParams();

  switch (number) {
    case '1':
      return <Part1 />;
    case '2':
      return (
        <div style={{ padding: '1rem' }}>
          <h2>Part 2</h2>
          <p>— your Part 2 component goes here —</p>
        </div>
      );
    case '3':
      return (
        <div style={{ padding: '1rem' }}>
          <h2>Part 3</h2>
          <p>— your Part 3 component goes here —</p>
        </div>
      );
    default:
      return (
        <div style={{ padding: '1rem' }}>
          <p>Invalid part number.</p>
        </div>
      );
  }
}
