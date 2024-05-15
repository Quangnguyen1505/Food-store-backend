const shopAdd = (noti_content) => {
    return noti_content = "@@@ Vừa mới thêm một sản phẩm mới @@@";
}

const discountAdd = (noti_content) => {
    return noti_content = "@@@ @@@ Có mã giảm giá mới @@@ @@@";
}

const setType = (noti_content, noti_type) => {
    const setTypeInNotiContent = {
        "SHOP-001" : shopAdd,
        "PROMOTION-001" : discountAdd
    }

    return setTypeInNotiContent[noti_type](noti_content);
}

module.exports = setType