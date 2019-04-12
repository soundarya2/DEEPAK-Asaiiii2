package com.siriuscom.ipl_scorer.bundle.services;

import java.io.IOException;
import java.io.StringWriter;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.http.client.ClientProtocolException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.apache.sling.commons.json.jcr.JsonItemWriter;

public class FirebaseHandler {
	FirebaseServiceWebConnector firebaseService=new FirebaseServiceWebConnector();
	public void postMatchSchemaData(ResourceResolver resource,String payload,Instant start,long startmilli)
	{
		
		
		long startmillis=System.currentTimeMillis();
		
		try
		{
		
		//to calculate date for match schema
		String year=calculateYear();
		String match_node=payload.substring(payload.indexOf("match_schema")+13,payload.indexOf("/",payload.indexOf("match_schema")+13));
		
		//To get JSON of the node
		Session session=resource.adaptTo(Session.class);
		System.out.println("Match_Node to be taken out ------->");
		//Node node=session.getNode("/content/ipl-scorer/schema/match_schema/"+match_node);
		Node node=session.getNode("/content/ipl-scorer/schema/match_schema");
		StringWriter stringWriter = new StringWriter();
		JsonItemWriter jsonWriter = new JsonItemWriter(null);
		jsonWriter.dump(node, stringWriter,6, true);
	
		String matchData = stringWriter.toString();
		firebaseService.postMatchSchemaData(payload,year,matchData,match_node,start);
		session.save();
		
	




		  long endmillis = System.currentTimeMillis();
	        System.out.println("Counting to 10000000 takes " +
	                                    (endmillis - startmillis) + "ms");
	     System.out.println("Ending each time ==================>");   
		}
		catch(Exception exception)
		{
			exception.printStackTrace();
		}
	}
	public void readFirebaseData(String matchName) throws ClientProtocolException, IOException
	{
		String year=calculateYear();
		String nodePath="/schema/match_schema/"+year+"/"+matchName;
		firebaseService.getFirebaseData(nodePath);
	}
	
	public String calculateYear()
	{
		Date date = new Date();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int yearData = calendar.get(Calendar.YEAR);
		String year=String.valueOf(yearData);
		return year;
	}
	public HashMap<String,String> getCurrentMatchDetails(String path) throws ClientProtocolException, IOException, JSONException
	{
		String value=null;
		String currentMatch=null;
		HashMap<String,String> current_match_array = new HashMap<String,String>();
		String year=calculateYear();
		String nodePath=path+year;
		String jsonData=firebaseService.getFirebaseData(nodePath);
		JSONObject data=new JSONObject(jsonData);
		Iterator<?> keys = data.keys();
		while( keys.hasNext() ) {
			JSONObject child = null;
			String key = (String)keys.next();
			System.out.println("key---"+key);
			child=data.getJSONObject(key);
		    if(child.has("current_match")&&child.getString("current_match").equals("true"))
		    {
		    	System.out.println("execution");
		    	String batting_team=child.getString("current_batting_team");
		    	String bowling_team=child.getString("current_bowling_team");
		    	String current_over=child.getString("current_over");
		    	String current_runs=child.getString("current_total_runs");
		    	
		    	current_match_array.put("batting_team",batting_team);
		    	current_match_array.put("bowling_team",bowling_team);
		    	current_match_array.put("current_over",current_over);
		    	current_match_array.put("current_runs",current_runs);
		    	currentMatch=key;
		       	current_match_array.put("match",currentMatch);
				break;
		    }
    }
		return current_match_array;
	}
	

	
}
