import React from 'react';
import './App.css';

class App extends React.Component <> {

    constructor(props) {
        super(props);
        this.state = {
            dataFromServer: [],
            numberOfItems: parseInt(localStorage.getItem("numberOfItems"), 10) || 0,
            installPrompt: undefined,
        }
    };

    getOneItemFromServer = () => {
        return fetch(`http://localhost:8080/data/1`, {mode: "cors"})
            .then((response) => {
                return response.json()
            });
    };

    getAllItemsFromServer = (numberOfItems) => {
        return fetch(`http://localhost:8080/data/${numberOfItems}`, {mode: "cors"})
            .then((response) => {
                return response.json()
            });
    };

    componentWillMount() {
        this.resetData();

        window.addEventListener('beforeinstallprompt', (e) => {
            this.setState(() => {
                return {installPrompt: e}
            })
        })
    };

    componentDidMount() {
        if (!navigator.onLine){
            this.setState(() => {
               return {
                   dataFromServer: JSON.parse(localStorage.getItem("data")),
               }
            });
        }
    };

    resetData = () => {
        if (!navigator.onLine){
            return;
        }
        this.getAllItemsFromServer(this.state.numberOfItems)
            .then((data) => {
                this.setState(() => {
                    return {dataFromServer: data}
                });
                localStorage.setItem("data", JSON.stringify(this.state.dataFromServer))
            })
    };

    addItem = () => {
        this.getOneItemFromServer()
            .then((data) => {
                this.setState(() => {
                    return {dataFromServer: this.state.dataFromServer.concat(data), numberOfItems: this.state.numberOfItems + 1}
                });
                localStorage.setItem("numberOfItems", this.state.numberOfItems);
                localStorage.setItem("data", JSON.stringify(this.state.dataFromServer))
            });
    };

    removeItem = async () => {
        if (this.state.numberOfItems === 0) {
            return;
        }
        await this.setState(() => {
            return {
                dataFromServer: this.state.dataFromServer.slice(0, this.state.numberOfItems - 1),
                numberOfItems: this.state.numberOfItems - 1
            }
        });
        localStorage.setItem("numberOfItems", this.state.numberOfItems);
        localStorage.setItem("data", JSON.stringify(this.state.dataFromServer))
    };

    installApp = () => {
        this.state.installPrompt.prompt();
    };

    render = () => (
        <div className="App">
            <button
                onClick={this.state.installPrompt ? this.installApp : undefined}
                className={this.state.installPrompt ? "install-button" : "hidden"}>
                Install App
            </button>
            <div>
                <button
                    onClick={this.removeItem}
                    className={navigator.onLine ? "enabled" : "disabled"}
                    disabled={!navigator.onLine}>
                    -
                </button>
                <button
                    onClick={this.resetData}
                    className={navigator.onLine ? "enabled" : "disabled"}
                    disabled={!navigator.onLine}>
                    Get New Data
                </button>
                <button
                    onClick={this.addItem}
                    className={navigator.onLine ? "enabled" : "disabled"}
                    disabled={!navigator.onLine}>
                    +
                </button>
            </div>
          <div>
              {this.state.dataFromServer.map((item) => {
                  return <div className={"data-item"}>{item}</div>
              })}
          </div>
        </div>
    );
}

export default App;
