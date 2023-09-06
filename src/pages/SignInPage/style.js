import { Input } from "antd";
import { styled } from "styled-components";
export const WrapperContainerLeft = styled.div`
    width: 500px;
    padding: 40px 45px 24px;
    background: rgb(255, 255, 255);
    border-radius: 20px 0px 0px 20px;
    `
export const WrapperContainerRight= styled.div`
    background: linear-gradient(136deg, rgb(240, 248, 255) -1%, rgb(219, 238, 255) 85%);
    width: 300px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    border-radius: 0px 20px 20px 0px;
    `
export const WrapperText = styled.p`
    color: rgb(120, 120, 120);
    font-size: 15px;
    margin: 10px 0px 0px;
    span.dk{
        color: rgb(13, 92, 182);
        display: inline-block;
        margin-left: 5px;
        cursor:pointer;
    }
    `
export const WrapperInput = styled(Input.Password)`
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0px;
    margin-bottom: 15px;
    outline: none;
    `