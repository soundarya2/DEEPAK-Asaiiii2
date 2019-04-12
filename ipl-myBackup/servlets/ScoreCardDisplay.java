package com.siriuscom.ipl_scorer.bundle.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.http.client.ClientProtocolException;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.osgi.service.component.annotations.Component;

import com.siriuscom.ipl_scorer.bundle.beans.DataBean;
import com.siriuscom.ipl_scorer.bundle.services.FirebaseHandler;
import com.siriuscom.ipl_scorer.bundle.services.FirebaseServiceWebConnector;

@Component(service = { Servlet.class },property = {
        "sling.servlet.resourceTypes=to/scoreCardData",
         "sling.servlet.methods=POST", 
         "sling.servlet.methods=GET"
    })
public class ScoreCardDisplay extends SlingAllMethodsServlet {
	FirebaseServiceWebConnector connector=new FirebaseServiceWebConnector();
	FirebaseHandler handler=new FirebaseHandler();
	
	
	@Override
	protected final void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws
            ServletException, IOException {
		
		System.out.println("get call");
		try
		{
		
		//DataBean matchData=new DataBean();

		String team_name=request.getParameter("team_name");
		
		HashMap<String,String> current_match_array = new HashMap<String,String>();
		
		current_match_array=handler.getCurrentMatchDetails("schema/match_schema/");
		
		//System.out.println(current_match_array);
		
		String current_match=current_match_array.get("match");
		String batting_team=current_match_array.get("batting_team");
		String bowling_team=current_match_array.get("bowling_team");
		
		/*System.out.println(current_match);
		System.out.println(batting_team);
		System.out.println(bowling_team);*/
		
		String url=null;
		
		if(team_name.equals("batting"))
		{
	         url="schema/match_schema/2018/"+current_match+"/playing_teams/"+batting_team+"/batting_stats";	
		}
		else
		{
			 url="schema/match_schema/2018/"+current_match+"/playing_teams/"+bowling_team+"/bowling_stats";						
		}
	   
		String jsonData=connector.getFirebaseData(url);
	    JSONObject batting_data=new JSONObject(jsonData);
	
	    JSONArray batting_data_array = new JSONArray();
		 
	    Iterator<?> keys = batting_data.keys();

	    while( keys.hasNext() ) {
	        String key = (String)keys.next();
	        Object value=batting_data.get(key);
	        batting_data_array.put(value);
	    }
	    
	    //matchData.setData(batting_data_array);
	   // JSONObject data=new JSONObject(matchData.toString());
	    
	    //System.out.println("datatattatatta----"+data);
	    response.setContentType("application/json");
	    PrintWriter out = response.getWriter();
	   // out.print(data);
	    out.flush();
	 }
		catch(Exception e)
		{
			e.printStackTrace();
		}
	
	}
	
}
