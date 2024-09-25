import { NamiIcon } from "@/components/icons/nami.icon";
import { getAddressDetails } from "lucid-cardano";
import BaseConnector from "./base.connector";
import * as Actions from "@/actions/auth.action";

let events: any = [];

class NamiConnector extends BaseConnector {
  constructor() {
    super({
      provider: window.cardano?.nami,
      name: "Nami",
      extensionLink:
        "https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo?hl=en",
      icon: NamiIcon,
    });
  }

  async subscribeEvents({ dispatch }: any) {
    if (events.length > 0) {
      return;
    }

    const api = await this.getApi();

    events.push({
      name: "accountChange",
      callback: (addresses: any) => {
        console.log(
          "[events] accountChange of Nami wallet -> addresses",
          addresses
        );
        const result = getAddressDetails(addresses[0]);
        dispatch(
          Actions.updateProvider({
            provider: {
              account: result.address.bech32,
            }
          })
        );
      },
    });
    events.forEach((event: any) => {
      console.log('api.experimental: ', api.experimental)
      api.experimental.on(event.name, event.callback);
    });
  }
  async unsubscribeEvents() {
    const api = await this.getApi();
    events.forEach((event: any) => {
      api.experimental.off(event.name, event.callback);
    });
    events = [];
  }
}

export default NamiConnector;
