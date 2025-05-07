useEffect(() => {
  const fetchDocs = async () => {
    try {
      const res = await axios.get("/api/docs", {
        headers: { Authorization: `Bearer ${user.jwt}` },
      });
      setDocs(res.data);
    } catch (err) {
      console.error("Auth failed", err);
    }
  };

  if (user?.jwt) fetchDocs();
}, [user]);
