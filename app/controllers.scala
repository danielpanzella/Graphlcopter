package controllers

import play._
import play.mvc._
import dispatch.{Request, Http => DHttp, url, :/}

object Application extends Controller {
    
    import views.Application._

    val http = new DHttp
    
    def index = {
        html.index()
    }

    def metrics(path: Option[String], start: Option[String], end: Option[String]) = {
        val veloHost = Play.configuration.get("velocigraphtor.host").toString
        val veloPort = Play.configuration.get("velocigraphtor.port").toString.toInt
        (path, start, end) match {
            case (Some(path), Some(start), Some(end)) => {
              val req = :/(veloHost, veloPort) <<? Map("path" -> path, "start" -> start, "end" -> end)
              http(req >- { x => Text(x) })
              // Text(result)
            }
            case _ => Text("missing parameters, set path, start, end")
        }
    }
}
