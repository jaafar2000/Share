const fetchPosts = async () => {
  try {
    const res = await fetch("/api/posts");
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default fetchPosts;

