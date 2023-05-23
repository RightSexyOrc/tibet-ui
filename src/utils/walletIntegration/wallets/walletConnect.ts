import WalletIntegrationInterface from '../walletIntegrationInterface';
import QRCodeModal from "@walletconnect/qrcode-modal";
import SignClient from "@walletconnect/sign-client";
import { toast } from 'react-hot-toast';

class WalletConnectIntegration implements WalletIntegrationInterface {
  name = "WalletConnect"
  image = "/assets/xch.webp"
  
  async connect(): Promise<boolean> {

    // If existing connection still exists, return true, else display QR code to initiate new connection
    if (await this.eagerlyConnect()) {
      return true;
    }



    // Sign client
    async function onInitializeSignClient() {
      try {
        const client = await SignClient.init({
          logger: "info",
          projectId: 'd8a8954b78975225ab6abcbc7c4c9f00',
          metadata: {
            name: "TibetSwap",
            description: "The first decentralized AMM running on the Chia blockchain.",
            url: "https://v2.tibetswap.io/",
            icons: ["https://v2.tibetswap.io/logo.jpg"],
          },
        });
        return client;
      } catch (e) {
        console.log(e);
        toast.error(`Wallet - ${e}`)
      }
    }
    
    try {
      // Initiate connection and pass pairing uri to the modal
      const signClient = await onInitializeSignClient();
        if (signClient) {
          const namespaces = {
            chia: {
              methods: [
                "chia_createOfferForIds",
                "chia_signMessageByAddress"
              ],
              chains: ["chia:mainnet"],
              events: [],
            },
          };

          const getActivePairTopic = () => {
            if (signClient.pairing.values.length > 0) {
              const activePairing = signClient.pairing.values.find(pairing => pairing.active === true)
              if (activePairing) {
                return activePairing.topic;
              }
            }
          }

          if (getActivePairTopic()) {
            console.log('Persisting previous connection')
            var { uri, approval } = await signClient.connect({
              pairingTopic: getActivePairTopic(), // Persist connection on refresh
              requiredNamespaces: namespaces,
            });
          } else {
            console.log('Creating new connection')
            var { uri, approval } = await signClient.connect({
              requiredNamespaces: namespaces,
            });
          }



          if (uri) {
            QRCodeModal.open(uri, () => {
              console.log("QR modal closed");
            });
          }
          const session = await approval();
          console.log('Connected Chia wallet via WalletConnect', session)
          QRCodeModal.close()
          toast.success('Successfully Connected')
          return true
        }
    } catch (error) {
      console.log('Error:', error)
      toast.error(`Wallet - ${error}`)
    }
    return false
  }

  async eagerlyConnect(): Promise<boolean> {
    // Sign client
    async function onInitializeSignClient() {
      try {
        const client = await SignClient.init({
          logger: "info",
          projectId: 'd8a8954b78975225ab6abcbc7c4c9f00',
          metadata: {
            name: "TibetSwap",
            description: "The first decentralized AMM running on the Chia blockchain.",
            url: "https://v2.tibetswap.io/",
            icons: ["https://v2.tibetswap.io/logo.jpg"],
          },
        });
        return client;
      } catch (error) {
        console.log(error);
        toast.error(`Wallet - ${error}`)
      }
    }
    
    try {
      // Initiate connection and pass pairing uri to the modal
      const signClient = await onInitializeSignClient();

      if (signClient?.pairing.getAll({ active: true }).length) {
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error(`Wallet - ${error}`)
      return false;
    }

    return false;
  }

  disconnect(): void {
    // WalletConnect disconnection logic
  }

  async generateOffer(requestAssets: {assetId: string; amount: number;}[], offerAssets: {assetId: string; amount: number;}[]): Promise<void> {

    console.log(requestAssets, offerAssets)

    // WalletConnect transaction signing logic
    
    async function onInitializeSignClient() {
      try {
        const client = await SignClient.init({
          logger: "info",
          projectId: 'd8a8954b78975225ab6abcbc7c4c9f00',
          metadata: {
            name: "TibetSwap",
            description: "The first decentralized AMM running on the Chia blockchain.",
            url: "https://v2.tibetswap.io/",
            icons: ["https://v2.tibetswap.io/logo.jpg"],
          },
        });
        return client;
      } catch (e) {
        console.log(e);
        toast.error(`Wallet - ${e}`)
      }
    }

    const client = await onInitializeSignClient();
    
    if (client) {
      const getActiveSessionTopic = () => {
        if (client.session.values.length > 0) {
          const activeSession = client.session.values.find(session => session.acknowledged === true)
          if (activeSession) {
            return activeSession.topic;
          }
        }
      }

      const topic = getActiveSessionTopic()
      if (!topic) return

      const result = await client.request({
        topic: topic,
        chainId: "chia:mainnet",
        request: {
          method: "chia_createOfferForIds",
          params: {
            offer: {
              "": 1002998692503,
              "d82dd03f8a9ad2f84353cd953c4de6b21dbaaf7de3ba3f4ddd9abe31ecba80ad": -572252,
            },
            driverDict: {},
            disableJSONFormatting: true
          },
        },
      });
    }
  }

  getBalance(): void {
    // WalletConnect balance retrieval logic
  }
}

export default WalletConnectIntegration;
