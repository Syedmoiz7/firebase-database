import { useState, useEffect } from 'react';
import './index.css'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

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


    useEffect(() => {

        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "posts"));
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => `, doc.data());

                setPostText((prev) => {
                    let newArray = [...prev, doc.data()]
                    return newArray
                })
                
            });
        }
        getData();

    }, [])

    const savePost = async (e) => {
        e.preventDefault()

        console.log("text of post: ", postText)

        try {
            const docRef = await addDoc(collection(db, "posts"), {
                text: postText,
                createdOn: new Date().getTime(),
            });
            console.log("Document written with ID: ", docRef.id);

        } catch (e) {
            console.error("Error adding document: ", e);
        }

    }



    return (
        <div className='main'>

            <form onSubmit={savePost}>
                <textarea
                    type="text"
                    placeholder='Whats in your mind...'
                    onChange={(e) => {
                        setPostText(e.target.value)
                    }}
                ></textarea>
                <br />
                <button type='submit'>Post</button>
            </form>

            <div className="renderPost">
                {(isLoading) ? "Loading..." : ""}

                {posts.map((eachPost, i) => (
                    <div className='post' key={i}>
                        <h3>{eachPost?.text}</h3>
                    </div>



                ))}
            </div>

        </div>
    )
}







export default DataBase;