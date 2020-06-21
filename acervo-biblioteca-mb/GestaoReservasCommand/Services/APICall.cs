using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;

public static class APICall
{
    private static HttpClient GetHttpClient(string url)
    {
        HttpClientHandler clientHandler = new HttpClientHandler();
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
        
        HttpClient client = new HttpClient(clientHandler);
        client.BaseAddress = new Uri(url);
        //var client = new HttpClient { BaseAddress = new Uri(url) };
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        
        return client;
    }

    private static async Task<List<T>> GetAsync<T>(string url, string urlParameters)
    {
        try
        {
            using (var client = GetHttpClient(url))
            {
                HttpResponseMessage response = await client.GetAsync(urlParameters);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var result = JsonConvert.DeserializeObject<List<T>>(json);
                    return result;
                }

                return default(List<T>);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return default(List<T>);
        }
    }

    public static async Task<List<T>> RunAsync<T>(string url, string urlParameters)
    {
        return await GetAsync<T>(url, urlParameters);
    }
}