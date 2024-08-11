import React, { Component } from "react";

import Modal from "./components/Modal";
import axios from "axios";

// リクエスト送信用のaxiosとモーダルをimport
class App extends Component {

    // Stateの設計からやり直す。
    constructor(props) {
        super(props);
        this.state = {
            topicList: [],
            modal: false,
            activeItem: {
                comment: "",
            },
        };
    }
    componentDidMount() {
        this.refreshList();
    }

    refreshList     = () => {
        axios
            .get("/api/topics/")
            .then((res) => this.setState({ topicList: res.data }))
            .catch((err) => console.log(err));
    };

    // モーダルダイアログを表示させ、idがあれば編集処理のダイアログを、なければ新規作成のダイアログを表示させる
    handleSubmit    = (item) => {

        if (item.id){
            axios
                .put(`/api/topics/${item.id}/`, item)
                .then((res) => {
                    this.refreshList();
                })
                .catch((err) => console.log(err));
        }
        else{
            axios
                .post("/api/topics/", item)
                .then((res) => {
                    this.refreshList();
                })
                .catch((err) => console.log(err));
        }

        this.closeModal();
    };

    handleDelete    = (item) => {
        axios
            .delete(`/api/topics/${item.id}/`)
            .then((res) => this.refreshList());
    };


    openModal       = (item) => {
        // 編集時はコメントをセット
        if (item.id){
            this.setState({ activeItem: item, modal: true });
        }
        else{
            this.setState({ activeItem: { comment:"" }, modal: true });
        }
    };
    closeModal      = () => {
        this.setState({ activeItem: { comment:"" }, modal: false });
    };


    // 改行をする
    linebreaksbr    = (string) => {

        // React.Fragment は <></> と同じであるが、今回はkeyを指定する必要があるため、React.Fragmentとする 
        return string.split('\n').map((item, index) => (
            <React.Fragment key={index}>
                {item}
                {index !== string.split('\n').length - 1 && <br />}
            </React.Fragment>
        )); 
    };

    renderItems     = () => {
        return this.state.topicList.map((item) => (
            <div className="border" key={item.id}>
                <div>{item.id}</div>
                <div>{ this.linebreaksbr(item.comment) }</div>
                <div className="text-end">
                    <input type="button" className="mx-1 btn btn-success" value="編集" onClick={ () => this.openModal(item) } />
                    <input type="button" className="mx-1 btn btn-danger" value="削除" onClick={ () => this.handleDelete(item) } />
                </div>
            </div>
        ));
    };
    render() {
        return (
            <>
                <h1 className="bg-primary text-white text-center">簡易掲示板</h1>
                <main className="container">

                    <input className="btn btn-primary" type="button" onClick={ () => this.openModal(this.state.activeItem) } value="新規作成" />
                    { this.state.modal ? ( <Modal activeItem    = {this.state.activeItem}
                                                  handleSubmit  = {this.handleSubmit}
                                                  closeModal    = {this.closeModal} /> ): null }
                    { this.renderItems() }

                </main>
            </>
        );
    };
}

export default App;

