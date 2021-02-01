import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CloudIcon from '@material-ui/icons/Cloud';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Link from '@material-ui/core/Link';

import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import CollectionsIcon from '@material-ui/icons/Collections';

const tableIcons = {
    Add: AddBox,
    Check: Check,
    Clear: Clear,
    Delete: DeleteOutline,
    DetailPanel: ChevronRight,
    Edit: Edit,
    Export: SaveAlt,
    Filter: FilterList,
    FirstPage: FirstPage,
    LastPage: LastPage,
    NextPage: ChevronRight,
    PreviousPage: ChevronLeft,
    ResetSearch: Clear,
    Search: Search,
    SortArrow: ArrowDownward,
    ThirdStateCheck: Remove,
    ViewColumn: ViewColumn
  };

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://microsoft.com/">
        Microsoft
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  content: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
  },
  paper: {
      padding: theme.spacing(3),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
  },
}));

export default function AzBlobView() {
  const classes = useStyles();
  const { useState, useEffect } = React;
  const [containers, setContainers] = useState([]);
  const [blobs, setBlobs] = useState([]);
  const [metaData, setMetaData] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState("");
  const [selectedBlob, setSelectedBlob] = useState("");
  
  useEffect(() => {
    const fetchContainers = async () => {
      const resp = await axios.get('/api/containers');
      setContainers(resp.data.containers);
    };
    fetchContainers();
  }, []);

  const selectContainer = (name) => {
      if (name !== selectedContainer) {
        axios.get('/api/containers/'+name)
          .then(function (resp) {
            setSelectedContainer(name);
            setBlobs(resp.data.blobs);
            setSelectedBlob(null);
            setMetaData([]);
          });
    }
  };

  const selectBlob = (row) => {
    setSelectedBlob(row.name);
    console.log(row);
    var m = [];
    for (const [key, value] of Object.entries(row)) {
      if (key !== "tableData") {
        m.push({property: key, value: value});
      }
    }
    setMetaData(m);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CloudIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            Azure Blob Storage Viewer
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Grid className={classes.content} container spacing={3}>
            <Grid item xs={3}>
                <MaterialTable
                    icons={tableIcons}
                    title="Containers"
                    columns={[
                        { width: 50, render: rowData => <CollectionsIcon /> },
                        { title: 'Name', field: 'name' },
                    ]}
                    data={containers}
                    onRowClick={((evt, selectedRow) => selectContainer(selectedRow.name))}
                    options={{
                        maxBodyHeight: "75vh",
                        search: false,
                        header: false,
                        //padding: "dense",
                        paging: false,
                        showSelectAllCheckbox: false,
                        selection: false,
                        showTextRowsSelected: false,
                        rowStyle: rowData => ({
                            backgroundColor: (selectedContainer === rowData.name) ? '#EEE' : '#FFF'
                        })
                    }}
                />
            </Grid>
            <Grid item xs={5}>
                <MaterialTable
                    icons={tableIcons}
                    title={selectedContainer}
                    columns={[
                        { title: 'Name', field: 'name', width: 500 },
                        { title: 'Last Modified', field: 'last_modified', width: 300 },
                        { title: 'Size', field: 'size', type: 'numeric', width: 100 },
                    ]}
                    data={blobs}
                    onRowClick={((evt, selectedRow) => selectBlob(selectedRow))}
                    options={{
                    maxBodyHeight: "70vh",
                    paging: true,
                    padding: "dense",
                    pageSize: 50,
                    pageSizeOptions: [ 50, 100, 250 ],
                    emptyRowsWhenPaging: false,
                    showSelectAllCheckbox: false,
                    selection: false,
                    showTextRowsSelected: false,
                    rowStyle: rowData => ({
                        backgroundColor: (selectedBlob === rowData.name) ? '#EEE' : '#FFF'
                    })
                    }}
                />
            </Grid>
            <Grid item xs={4}>
            <MaterialTable
                    icons={tableIcons}
                    title={selectedBlob}
                    columns={[
                        { title: 'Property', field: 'property' },
                        { title: 'Value', field: 'value' },
                    ]}
                    data={metaData}
                    options={{
                        maxBodyHeight: "70vh",
                        paging: false,
                        search: false,
                        showSelectAllCheckbox: false,
                        selection: false,
                        showTextRowsSelected: false
                    }}
                />
            </Grid>
        </Grid>
        
      </main>
      <footer className={classes.footer}>
        <Copyright />
      </footer>
    </React.Fragment>
  );
}
