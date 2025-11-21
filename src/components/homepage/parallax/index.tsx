'use client';
import { useEffect } from 'react';
import Lenis from 'lenis'
import Intro from './Intro';
import OurStory from './OurStory';
import Section from './Section';
export default function Parallax() {
  useEffect( () => {
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [])

  return (
    <div>
      <Intro />
      <OurStory />
      <Section />
    </div>
  );
}