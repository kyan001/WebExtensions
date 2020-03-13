import java.awt.*;
import java.applet.*;
import java.awt.event.*;
import java.util.*;

public class Applet1 extends Applet{
	int r=100,g=100,b=100;
	int nx=15;
	int ny=30;
	int plusR = 0;
	int plusG = 0;
	int plusB = 0;
	int minus = 10;
	int lv = 1;
	int lvTemp = 1;
	int lvMAX = 6;
	int exp = 0;
	int lbound = 0;
	int ubound = 0;
	Label s = new Label("show");
	Random rnd = new Random();
	int deciderR = rnd.nextInt(2);
	int deciderG = rnd.nextInt(2);
	int deciderB = rnd.nextInt(2);
	Panel[] p = new Panel[nx*ny];

	public void init() {
		setLayout(new BorderLayout());
		Panel mainPanel = new Panel();
		mainPanel.setLayout(new GridLayout(nx,ny));
		add("Center",mainPanel);
		for(int i=0;i<nx*ny;i++){
			p[i] = new Panel();
			p[i].setBackground(Color.white);
			mainPanel.add(p[i]);
		}
		add("North",s);
		p[200].setBackground(Color.black);

	}
	public void start() {

	}
	public void stop() {

	}
	public void paint(Graphics g)	{
	}
	public boolean action(Event e,Object o){
		if(false)
		{
		}
		else
			return super.action(e,o);
		return true;
	}
	public boolean mouseEnter(Event e, int x, int y) {
		if(((Panel)(e.target)).getBackground().equals(Color.black)){
			if((++exp)==lv*lv){
				lv++;
				exp=0;
			}
			minus = lv*lv -exp;
			int newx = rnd.nextInt(nx*ny);
			p[newx].setBackground(Color.black);
		}
		if(lv<=lvMAX)
			lvTemp = lv;
		lbound = 20*lvMAX/lvTemp;
		ubound = 240/lvMAX*lvTemp;
		if(r<lbound||r>ubound){
			deciderR=1-deciderR;
			r+=(plusR*(Math.pow(-1,deciderR)));
		}
		if(g<lbound||g>ubound){
			deciderG=1-deciderG;
			g+=(plusG*(Math.pow(-1,deciderG)));
		}
		if(b<lbound||b>ubound){
			deciderB=1-deciderB;
			b+=(plusB*(Math.pow(-1,deciderB)));
		}
		s.setText(
//			"R/G/B:"+r+"/"+g+"/"+b+
//			" ***** "+deciderR+"/"+deciderG+"/"+deciderB +
//			" ***** " + plusR*(Math.pow(-1,deciderR)) +"/"+plusG*(Math.pow(-1,deciderG))+"/"+plusB*(Math.pow(-1,deciderB))+
			" ***** " + "[等级Lv " + lv + "] [" + "经验Exp: " + exp + "/" + lv*lv + "] ***** " + "(Lv " + lvMAX + " = Max effect)");
		if(r>=0&&r<=254)
		plusR = rnd.nextInt(10);
		r+=(plusR*(Math.pow(-1,deciderR)));
		plusG = rnd.nextInt(10);
		if(g>=0&&g<=254)
		g+=(plusG*(Math.pow(-1,deciderG)));
		plusB = rnd.nextInt(10);
		if(b>=0&&b<=254)
		b+=(plusB*(Math.pow(-1,deciderB)));
		((Panel)(e.target)).setBackground(new Color(r,g,b));
		for(int i=0;i<nx*ny;i++){
			if((!p[i].getBackground().equals(Color.white)) && (!p[i].getBackground().equals(Color.black))){
			int rr=p[i].getBackground().getRed();
			int gg=p[i].getBackground().getGreen();
			int bb=p[i].getBackground().getBlue();
			if(rr<255){
				rr+=minus;
				if(rr>255)
					rr=255;
			}
			else if(gg<255){
				gg+=minus;
				if(gg>255)
					gg=255;
			}
			else if(bb<255){
				bb+=minus;
				if(bb>255)
					bb=255;
			}
			p[i].setBackground(new Color(rr,gg,bb));
			}
		}
		return true;
	}
}
