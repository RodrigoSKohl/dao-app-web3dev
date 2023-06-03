const { data: S1 } = useNFTBalance(editionDrop, address, "0")
const { data: S2 } = useNFTBalance(editionDrop, address, "1")
const { data: S3 } = useNFTBalance(editionDrop, address, "2")
  
 

//se tem o NFT
  const S1Pass = useMemo(() => {
    return S1 && S1.gt(0)
  }, [S1])

  const S2Pass = useMemo(() => {
    return S2 && S2.gt(0)
  }, [S2])

  const S1Pass = useMemo(() => {
    return S3 && S3.gt(0)
  }, [S3])