import GoogleMaps
import GoogleMapsUtils

class MarkerClustering: UIViewController, GMSMapViewDelegate {
  private var mapView: GMSMapView!
  private var clusterManager: GMUClusterManager!

  override func viewDidLoad() {
    super.viewDidLoad()

    // Set up the cluster manager with the supplied icon generator and
    // renderer.
    let iconGenerator = GMUDefaultClusterIconGenerator()
    let algorithm = GMUNonHierarchicalDistanceBasedAlgorithm()
    let renderer = GMUDefaultClusterRenderer(mapView: mapView,
                                clusterIconGenerator: iconGenerator)
    clusterManager = GMUClusterManager(map: mapView, algorithm: algorithm,
                                                      renderer: renderer)

    // Register self to listen to GMSMapViewDelegate events.
    clusterManager.setMapDelegate(self)
    // ...
  }
  // ...
}

let markerArray = [marker1, marker2, marker3, marker4] // define your own markers
clusterManager.add(markerArray)

clusterManager.cluster()