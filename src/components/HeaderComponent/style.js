import { Row } from "antd";
import { styled } from "styled-components"
export const WrapperHeader = styled(Row)`
    padding: 30px 120px;
    background: rgb(26, 148, 255);
    flex-wrap: wrap;
    align-items: center`
export const WrapperTextHeader = styled.span`
    font-size: 20px;
    color: #fff;
    font-weight: 5px;
    text-align: left`
export const WrapperHearderAccount = styled.div`
    color: #fff;
    display: flex;
    gap: 10px;
    margin-left: 50px;
    align-items: center`
export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        color: rgb(26, 148, 255);
        font-weight: 500
    }`