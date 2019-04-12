package com.siriuscom.ipl_scorer.bundle.services;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.time.Duration;
import java.time.Instant;
import java.util.Calendar;
import java.util.Date;

import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.commons.json.jcr.JsonItemWriter;


public class FirebaseServiceWebConnector {
		String path="https://iplscorer-6ba55.firebaseio.com/";
		public void postMatchSchemaData(String payload,String year,String matchData,String match_node,Instant start)
		{
			start = Instant.now();
		  
			try
			{
			CloseableHttpClient client = HttpClients.createDefault();
		    //HttpPatch httpPatch=new HttpPatch(path+"/schema/match_schema/"+year+"/"+match_node+".json");
			HttpPatch httpPatch=new HttpPatch(path+"/schema/match_schema.json");
			StringEntity entity = new StringEntity(matchData);
		    httpPatch.setEntity(entity);
		    httpPatch.setHeader("Accept","application/json");
		    httpPatch.setHeader("Content-type", "application/json");
		    HttpResponse response = client.execute(httpPatch);
		    client.close();

			Instant end = Instant.now();

			Duration interval = Duration.between(start, end);

			System.out.println("Execution time in seconds: " + interval.getSeconds());
			}
			catch(Exception exception)
			{
				exception.printStackTrace();
			}
		}
		public String getFirebaseData(String nodePath) throws ClientProtocolException, IOException
		 {
			HttpClient httpClient = new DefaultHttpClient();
			HttpGet getRequest = new HttpGet(path+nodePath+".json");
			getRequest.addHeader("accept", "application/json");
			HttpResponse response = httpClient.execute(getRequest);
			if (response.getStatusLine().getStatusCode() != 200) {
				throw new RuntimeException("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
			}
			BufferedReader br = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
			String JSON = "";
			String output;
			while ((output = br.readLine()) != null) {
				JSON = JSON + output;
			}
			httpClient.getConnectionManager().shutdown();
			return JSON;
		 } 
		
		
		
}
