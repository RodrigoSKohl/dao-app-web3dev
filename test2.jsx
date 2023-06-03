const [setAllNftPass] = useState([]);

useEffect(() => {
  const fetchNftData = async () => {
    const totalCount = await editionDrop.totalCount();
    const promises = [];
    for (let i = 0; i < totalCount; i++) {
      promises.push(useNFTBalance(editionDrop, address, String(i)));
    }

    const nftBalanceData = await Promise.all(promises);

    const updatedNftPassData = nftBalanceData.map((data) => {
      return data && data.gt(0);
    });

    setAllNftPass(updatedNftPassData);
  };

  fetchNftData();
}, [editionDrop, address]);