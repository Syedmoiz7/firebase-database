import { useState, useEffect } from 'react';
import './index.css'
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection,
    addDoc, getDocs, doc, deleteDoc, updateDoc,
    onSnapshot, query, serverTimestamp, orderBy
} from "firebase/firestore";
import moment from 'moment/moment';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyBQj6wGfFmrR9nubeTUclCOwheDQaJs-CA",
    authDomain: "database-1st-3f30c.firebaseapp.com",
    projectId: "database-1st-3f30c",
    storageBucket: "database-1st-3f30c.appspot.com",
    messagingSenderId: "937526687176",
    appId: "1:937526687176:web:1dd11be31cbb1f9eddbcfd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);





function DataBase() {
    const [postText, setPostText] = useState("");
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [isEditing, setIsEditing] = useState(null)
    const [editingText, setEditingText] = useState("")

    const [editing, setEditing] = useState({
        editingId: null,
        editingText: ""
    })



    useEffect(() => {

        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "posts"));

            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => `, doc.data());

                setPosts((prev) => {
                    let newArray = [...prev, doc.data()]
                    return newArray
                })

            });
        }
        // getData();

        let unsubscribe = null;
        const getRealTimeData = async () => {

            const q = query(collection(db, "posts"), orderBy("createdOn", "desc"));

            unsubscribe = onSnapshot(q, (querySnapshot) => {
                const posts = [];
                querySnapshot.forEach((doc) => {
                    // posts.push(doc.data());

                    let data = doc.data();
                    data.id = doc.id;

                    posts.push(data);

                });

                setPosts(posts)

                console.log("posts: ", posts);
            });
        }
        getRealTimeData();


        return () => {
            console.log("clean up");
            unsubscribe();
        }

    }, [])

    const savePost = async (e) => {
        e.preventDefault()

        console.log("text of post: ", postText)

        try {
            const docRef = await addDoc(collection(db, "posts"), {
                text: postText,
                // createdOn: new Date().getTime()
                createdOn: serverTimestamp()
            });
            console.log("Document written with ID: ", docRef.id);

        } catch (e) {
            console.error("Error adding document: ", e);
        }

    }

    const deletePost = async (postId) => {
        await deleteDoc(doc(db, "posts", postId));
    }

    const updatePost = async (e) => {
        e.preventDefault()

        await updateDoc(doc(db, "posts", editing.editingId), {
            text: editing.editingText
        });

        setEditing({
            editingId: null,
            editingText: ""

        })
    }

    const edit = (postId, text) => {

       


        // const updatedState =
        //     posts.map(eachItem => {
        //         if (eachItem.id === postId) {
        //             return { ...eachItem, isEditing: !eachItem.isEditing }
        //         } else {
        //             return eachItem
        //         }

        //     })

        // setPosts(updatedState)

    }


    return (
        <div className='main'>

            <form onSubmit={savePost}>
                <textarea
                    type="text"
                    placeholder='Whats in your mind...'
                    onChange={(e) => {
                        setEditing(e.target.value)
                    }}
                ></textarea>
                <br />
                <button type='submit'>Post</button>
            </form>

            <div className="renderPost">
                {(isLoading) ? "Loading..." : ""}

                {posts.map((eachPost, i) => (
                    <div className='post' key={i}>

                        <h3>{(eachPost.id === editing.editingId) ?
                            <form onSubmit={updatePost}>
                                <input type="text" value={editing.editingText}
                                    placeholder="Please enter updated value"
                                    onChange={(e) => {
                                        setEditing({...editing, editingText: e.target.value})
                                    }} />

                                    <button type='submit'>Update</button>
                            </form>
                            :
                            eachPost?.text}
                        </h3>

                        <p>{moment(
                            (eachPost?.createdOn?.seconds) ?
                                eachPost?.createdOn?.seconds * 1000
                                :
                                undefined)
                            .format('Do MMM, h:mm a')}
                        </p>

                        <button onClick={() => { deletePost(eachPost?.id) }}>
                            Delete
                        </button>

                        {(editing.editingId === eachPost?.id) ?
                        ""  
                        :
                        <button onClick={() => { 

                            setEditing({
                                editingId: eachPost?.id,
                                editingText: eachPost?.text
                            })}}>

                            Edit
                        </button>}

                            for github login in laptop

                    </div>



                ))}
            </div>

        </div>
    )
}







export default DataBase;