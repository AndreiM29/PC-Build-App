import React from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    listStyleType: 'none',
  },
  menuItem: {
    marginRight: theme.spacing(2),
    '& a': {
      textDecoration: 'none',
      color: '#333',
      padding: theme.spacing(1),
      transition: 'color 0.3s ease',
    },
    '& a.active': {
      color: '#ff6b6b',
    },
  },
}));

const Menu = () => {
  const classes = useStyles();

  return (
    <ul className={classes.container}>
      <li className={classes.menuItem}>
        <NavLink exact to="/" activeClassName="active">Home</NavLink>
      </li>
      <li className={classes.menuItem}>
        <NavLink to="/motherboards" activeClassName="active">Motherboards</NavLink>
      </li>
      <li className={classes.menuItem}>
        <NavLink to="/cases" activeClassName="active">Cases</NavLink>
      </li>
      <li className={classes.menuItem}>
        <NavLink to="/cpus" activeClassName="active">CPUs</NavLink>
      </li>
      <li className={classes.menuItem}>
        <NavLink to="/gpus" activeClassName="active">GPUs</NavLink>
      </li>
      <li className={classes.menuItem}>
        <NavLink to="/ram" activeClassName="active">RAM</NavLink>
      </li>
      <li className={classes.menuItem}>
        <NavLink to="/storagedrive" activeClassName="active">Storage Drive</NavLink>
      </li>
      <li className={classes.menuItem}>
        <NavLink to="/powersupply" activeClassName="active">Power Supply</NavLink>
      </li>
      {/* Add more menu items as needed */}
    </ul>
  );
};

export default Menu;
