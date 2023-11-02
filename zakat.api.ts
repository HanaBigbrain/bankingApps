import { ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import type { AccountResponse, AccountTypeResponse, ApiConfig, zakatInItResponse } from "./api.types"
import { API_URL_PATH } from "./api.url.path"

/**
 * Configuration object for the DuitNowAPI.
 * @typedef {Object} ApiConfig
 * @property {string} url - The base URL of the API.
 * @property {number} timeout - The request timeout in milliseconds.
 */

/**
 * Configuring the apisauce instance.
 */
class APIError extends Error {
  errorJson: any
  constructor(errorJson) {
    super(errorJson)
    this.errorJson = errorJson
  }
}

const API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

export class ZakatAPI {

  apisauce: ApisauceInstance
  config: ApiConfig
  constructor(config: ApiConfig = API_CONFIG) {

    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }
  /**
   * Sends a zakat request entry to the server.
   * @param jwtToken - The JWT token for authentication.
   * @returns A promise that resolves to the response from the server.
   * @throws Will throw an error if the request fails.
   */
   getZakatInIt = async (jwtToken: string) => {
    try {
      console.debug("A1")
        const res = await this.apisauce.get(
          API_URL_PATH.ZAKAT.GET_ZAKATINIT,
          {},
        {
          headers: {
            bearer: jwtToken,
          },
        },
      )       
      console.debug("A2")
      console.debug("res1:" + res)
      console.debug("res:" + JSON.stringify(res))
      console.debug("res.ok:" + res.ok)
      console.debug("res.data:" + JSON.stringify(res.data))
      console.debug("res.problem:" + res.problem)
      console.debug("res.problemJSON:" + JSON.stringify(res.problem))
        if (res.ok && res.data) {
          return res.data as zakatInItResponse
        } else {
          throw new APIError(res.data)
        }
      } catch (error) {
        console.debug("A10")
        console.error(`Error when firing getZakatBody: ${error}`)
        console.debug("A10")
        console.error(`Error when firing getZakatBody: ${JSON.stringify(error)}`);

        throw error
      }
  
}
}

// Singleton instance of the API for convenience
export const zakatAPI = new ZakatAPI()