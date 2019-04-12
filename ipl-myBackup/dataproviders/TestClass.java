package com.siriuscom.ipl_scorer.bundle.dataproviders;

import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.osgi.service.component.annotations.Reference;

import com.adobe.cq.sightly.WCMUsePojo;

public class TestClass extends WCMUsePojo {
	private String testString = "Hello IPL Scorer";
	
	Node node;
	
	@Reference
	private ResourceResolverFactory resolverFactory;
	
	@Override
	public void activate() throws Exception {
		System.out.println("sdssdds");
		 ResourceResolver resource=resolverFactory.getAdministrativeResourceResolver(null);
	     Session session=resource.adaptTo(Session.class);
	      node=session.getNode("/content/ipl-scorer/iplScorerHomePage/jcr:content");
	     node.setProperty("execution",true);		
	}
	public String getTestString() {
		return testString;
	}
	public void setTestString(String testString) {
		this.testString = testString;
	}
	
	
	
}
