import { Image } from "antd";
import { styled } from "styled-components";
export const WrapperImageSmall = styled(Image)`
    height: 64px;
    width: 64px;`
export const WrapperStyleNameProduct = styled.h1`
    color: rgb(36, 36, 36);
    font-size: 24px;
    font-weight: 300;
    line-height: 32px;
    word-break: break-word;`
export const WrapperBrand = styled.div`
    font-size: 13px;
    line-height: 10px;
    color: rgb(13, 92, 182);`
export const WrapperReviewText = styled.div`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120, 120, 120);
    display: flex;
    align-items: center`
export const WrapperPriceProduct = styled.div`
    border-radius: 4px;
    margin-top: 10px;
    background: rgb(250, 250, 250);`
export const WrapperTextPriceProduct = styled.div`
    font-size: 32px;
    line-height: 40px;
    margin-right: 8px;
    padding: 10px;
    font-weight: 500;`
export const WrapperAddressProduct = styled.div`
    span.address {
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    },
    span.address-change {
        color: rgb(11, 116, 229);
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
        flex-shrink: 0;
    }`
export const WrapperTextQuality = styled.p`
    font-size: 15px;
    line-height: 1;
    ;`
export const WrapperQuality = styled.div`
    display: flex;
    -webkit-box-align: center;
    height: 30px;
    color: rgb(36, 36, 36);
    font-size: 14px;
    outline: none;
    ;`
export const WrapperButtonQuality = styled.button`
    width: 30px;
    background-color: rgb(255, 255, 255);
    border: 1px solid rgb(236, 236, 236);
    border-radius: 4px 0px 0px 4px;
;`
