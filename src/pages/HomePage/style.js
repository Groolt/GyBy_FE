import { styled } from "styled-components";
import ButtonSearch from "../../components/ButtonSearch/ButtonSearch";

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 64px;
    justify-content: flex-start;
    height: 44px;
    `

export const WrapperButtonMore = styled(ButtonSearch)`
    background: #fff;    
    &:hover {
    color: #fff;
    background: #9255FD;
    span {
        color: #fff;
    }
    width: 100%;
    text-align: center;}`

export const WrapperProduct = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
    flex-wrap:wrap`