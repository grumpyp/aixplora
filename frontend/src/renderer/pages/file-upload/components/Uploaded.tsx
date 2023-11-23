import { useState } from 'react';
import { createStyles, Table, ScrollArea, rem } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

interface TableScrollAreaProps {
  data: { name: string; type: string; size: number }[];
}

export default function UploadedTable({ data }: TableScrollAreaProps) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  console.log("--------------");
  console.log(data);
  const rows = data.map((row) => (
    <tr key={row.name}>
      <td>{row.name}</td>
      <td>{row.type}</td>
      <td>{Math.floor(row.size / 1000)} kb</td>
    </tr>
  ));

  return (
    <ScrollArea
      h={300}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table miw={700}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>name</th>
            <th>type</th>
            <th>size</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
