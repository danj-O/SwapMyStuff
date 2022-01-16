export const getNFTsForSwap = () => {
    let NFTsForSwap = document.getElementById('board-2')
    NFTsForSwap = [...NFTsForSwap.children]
    const NFTsArray = []
    NFTsForSwap.forEach(el => {
        NFTsArray.push(el.dataset)
    });
    return NFTsArray
}