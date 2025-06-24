import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {TuiAppearance, TuiIcon, TuiSurface, TuiTitle} from '@taiga-ui/core';
import {TuiAvatar, TuiBadge} from '@taiga-ui/kit';
import {TuiCardLarge, TuiCell} from '@taiga-ui/layout';
import { LandsService } from '../../../core/services/lands.service';
import { AuthService } from '../../../core/services/auth.service';
import { ConfigService } from '../../../core/services/config.service';
import { LandDTO } from '../../../shared/models/land.model';
import { UserProfile } from '../../../shared/models/user.model';
import { LandImageService } from '../../../core/services/land-image.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-land-list',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    TuiAppearance,
    TuiIcon,
    TuiSurface,
    TuiTitle,
    TuiAvatar,
    TuiBadge,
    TuiCardLarge,
    TuiCell
  ],
  templateUrl: './land-list.component.html',
  styleUrls: ['./land-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandListComponent implements OnInit {
  lands: LandDTO[] = [];
  landsWithImages: LandDTO[] = [];
  imageBaseUrl = environment.imageBaseUrl;

  constructor(
    private landsService: LandsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private configService: ConfigService,
    private landImageService: LandImageService
    ) {
    }

  ngOnInit(): void {
    const user: UserProfile | null = this.authService.getCurrentUserValue();
    if (user && user.id) {
      this.landsService.getLandsByUserId(user.id).subscribe({
        next: (res: any) => {
          this.lands = res.page.content;
          this.loadImagesForLands();
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          console.error('Erreur lors du chargement des terrains:', err);
        }
      });
    }
  }

  loadImagesForLands(): void {
    if (this.lands.length === 0) {
      this.landsWithImages = [];
      return;
    }

    const imageRequests = this.lands.map(land =>
      this.landImageService.getImagesByLandId(land.id).pipe(
        map(images => ({ ...land, images })),
        catchError(() => of({ ...land, images: [] })) // En cas d'erreur, retourne le terrain sans images
      )
    );

    forkJoin(imageRequests).subscribe(landsWithImages => {
      this.lands = landsWithImages;
      this.cdr.markForCheck();
    });
  }
}
