package com.siriuscom.ipl_scorer.bundle.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.osgi.service.component.annotations.Component;

import com.siriuscom.ipl_scorer.bundle.services.FirebaseHandler;

@Component(service = { Servlet.class },property = {
        "sling.servlet.resourceTypes=to/currentMatchDetails",
         "sling.servlet.methods=POST", 
         "sling.servlet.methods=GET"
    })
public class CurrentMatchDetails extends SlingAllMethodsServlet{

	FirebaseHandler handler=new FirebaseHandler();
	@Override
	protected final void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws
            ServletException, IOException {
       
		try {
			 HashMap<String,String> current_match_array = new HashMap<String,String>();
			 current_match_array=handler.getCurrentMatchDetails("schema/match_schema/");
				String current_match=current_match_array.get("match");
				String batting_team=current_match_array.get("batting_team");
				String bowling_team=current_match_array.get("bowling_team");
				String current_over=current_match_array.get("current_over");
			    String current_total_runs=current_match_array.get("current_runs");
			    HashMap<String,String> data=new HashMap<String,String>();	
			    data.put("current_match",current_match);
			    data.put("batting_team",batting_team);
			    data.put("bowling_team",bowling_team);
			    data.put("current_over",current_over);
			    data.put("current_total_runs",current_total_runs);
			    
			    JSONObject dataJson=new JSONObject(data);
			    response.setContentType("application/json");
			    PrintWriter out = response.getWriter();
			    out.print(dataJson);
			    out.flush();    
			
		}
		catch(Exception e)
		{
			
		}
			
		
		
	}
}
