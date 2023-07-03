import React, {useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import {SERVER_URL, NEWS_API_GET_ALL_ENDPOINT} from '../../config.json'

const NewsPostsList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/${NEWS_API_GET_ALL_ENDPOINT}`);
            const data = await response.json();
            setPosts(data.items);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    return (
        <View>
            {posts.map((item, index) => (
                <View key={item.guid}>
                    <Text>Title: {item.title}</Text>
                    <Text>Link: {item.link}</Text>
                    <Text>Description: {item.description}</Text>
                    <Text>PubDate: {item.pubDate}</Text>
                    <Text>GUID: {item.guid}</Text>
                    <Text>Comments: {item.comments}</Text>
                    <Image source={{uri: item.enclosure[0]}} style={{width: 200, height: 150}}/>
                    <Text>Content: {item.content[0]}</Text>
                </View>
            ))}
        </View>
    );
};

export default NewsPostsList;
