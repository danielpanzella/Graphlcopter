package controllers

import play._
import play.mvc._
import dispatch.{Request, Http => DHttp, url, :/}

object Application extends Controller {
  import views.Application._

  val veloHost = Play.configuration.get("velocigraphtor.host").toString
  val veloPort = Play.configuration.get("velocigraphtor.port").toString.toInt
  val http = new DHttp

  def index = {
    html.index()
  }

  def browse(metric: Option[String]) = {
    val p = metric.getOrElse("*")
    val req = (:/(veloHost, veloPort) / "browse") <<? Map("metric" -> p)
    http(req >- { x => Json(x) })
  }

  def metrics(path: Option[String], start: Option[String], end: Option[String]) = {
    (path, start, end) match {
      case (Some(path), Some(start), Some(end)) => {
        val req = :/(veloHost, veloPort) <<? Map("path" -> path, "start" -> start, "end" -> end)
        http(req >- { x => Json(x) })
        // Text(result)
      }
      case _ => Text("missing parameters, set path, start, end")
    }
  }
}
