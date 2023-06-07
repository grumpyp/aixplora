import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import logoimage from './assets/AIxplora_logo_round.jpg';
import '../styles/components.css';

const HEADER_HEIGHT = rem(60);


interface HeaderResponsiveProps {
  links: { link: string; label: string }[];
}

export function HeaderResponsive({ links }: HeaderResponsiveProps) {
  const items = links.map((link) => (
    <Link key={link.label} to={link.link} className="single_link">
      <li className="link">{link.label}</li>
    </Link>
  ));

  return (
    <header>
      <div className="logo">
        <img src={logoimage} width={'50'} alt="" />
      </div>
      <ul className="nav">{items}</ul>
    </header>
  );
}

export default HeaderResponsive;
