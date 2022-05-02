// ---[ import ]-------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { Button, Card } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import purple from '@material-ui/core/colors/purple';
import axios from 'axios';
import PostFrom from '../components/PostFrom';


// ---[ component ]----------------------------------------------------------------
const useStyles = makeStyles((theme) => createStyles({
    card: {
        margin: theme.spacing(5),
        padding: theme.spacing(3),
    },
    table: {
        minWidth: 650,
      },
    tableHead: {
        backgroundColor: purple['A100'],
    },
}));

const headerList = [
    '名前',
    'タスク内容',
    '編集',
    '完了'
];


function Home() {
    // ---[ 処理 ]--------------------------------------------------------------------
    const classes = useStyles();

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getPostsData();
    },[])

    const [formData, setFormData] = useState({name:'', content:''});

    const getPostsData = () => {
        axios
            .get('/api/posts')
            .then(response => {
                setPosts(response.data);
            })
            .catch(() => {
                console.log('通信に失敗しました');
            });
    }

    const inputChange = (e) => {
        const key = e.target.name;
        const value = e.target.value;
        formData[key] = value;
        let data = Object.assign({}, formData);
        setFormData(data);
    }

    const createPost = async() => {
        if(formData == ''){
            return;
        }
        await axios
            .post('/api/post/create', {
                name: formData.name,
                content: formData.content
            })
            .then((res) => {
                //戻り値をtodosにセット
                const tempPosts = posts
                tempPosts.push(res.data);
                setPosts(tempPosts)
                setFormData('');
            })
            .catch(error => {
                console.log(error);
            });
    }

    const deletePost = async (post) => {
        await axios
            .post('/api/delete', {
            id: post.id
        })
        .then((res) => {
            this.setState({
                posts: res.posts
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    let rows = [];
    posts.map((post) =>
        rows.push({
            name: post.name,
            content: post.content,
            editBtn: <Button color="secondary" variant="contained" key={post.id} href={`/post/edit/${post.id}`}>編集</Button>,
            deleteBtn: <Button color="primary" variant="contained" href="/" onClick={() => deletePost(post)}>完了</Button>,
        })
    );

    // ---[ return ]-----------------------------------------------------------------
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <h1>タスク</h1>
                        <Card className={classes.card}>
                            <PostFrom data={formData} btnFunc={createPost} inputChange={inputChange} />
                        </Card>
                        <Card className={classes.card}>
                            {/* テーブル部分の定義 */}
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="simple table">
                                    {/* ヘッダー部分 */}
                                    <TableHead className={classes.tableHead}>
                                        <TableRow>
                                            {headerList.map((item, index) => (
                                                <TableCell align="center" key={index}>{item}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                     {/* ボディ部分 */}
                                    <TableBody>
                                        {rows.map((row, index) => (
                                            <TableRow key={index}>
                                                {Object.keys(row).map(function(key, i) {
                                                    return(
                                                        <TableCell align="center" key={i}>{row[key]}</TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

